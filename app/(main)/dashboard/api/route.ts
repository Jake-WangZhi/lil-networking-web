import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Activity, Contact } from "@prisma/client";
import { Action, UserType, ActivityType, SearchParams } from "@/types";
import { differenceInDays } from "date-fns";
import { getActionType } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get(SearchParams.Email);

  if (!email)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No User Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const contacts = await prisma.contact.findMany({
    where: {
      userId: user.id,
    },
  });

  const activeContacts = contacts.filter((c) => !c.isArchived);

  const activeContactIds = activeContacts.map((c) => c.id);

  const activities = await prisma.activity.findMany({
    where: {
      contactId: { in: activeContactIds },
    },
    orderBy: [
      { type: "asc" },
      {
        date: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    distinct: ["contactId"],
  });

  const goals = await prisma.goals.findUnique({
    where: {
      userId: user.id,
    },
  });

  const isMeetGoals =
    goals &&
    goals.connections >= goals.goalConnections &&
    goals.messages >= goals.goalMessages &&
    goals.goalConnections > 0 &&
    goals.goalMessages > 0;

  if (goals && goals.hasShownConfetti === false && isMeetGoals) {
    await prisma.goals.update({
      where: {
        userId: user.id,
      },
      data: {
        hasShownConfetti: true,
      },
    });
  }

  const sortedActivities = activities.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const actions = parseActions(activeContacts, sortedActivities);

  return NextResponse.json({
    ...actions,
    hasContacts: !!contacts.length,
    hasViewedDashboardTutorial: user.hasViewedDashboardTutorial,
    showConfetti: !goals?.hasShownConfetti && isMeetGoals,
  });
}

const parseActions = (contacts: Contact[], activities: Activity[]) => {
  const priorityActions: Array<Action> = [];
  const upcomingActions: Array<Action> = [];

  const contactIndex: Record<string, Contact> = {};
  contacts.forEach((contact) => {
    contactIndex[contact.id] = contact;
  });

  for (const activity of activities) {
    const contact = contactIndex[activity.contactId];

    if (contact) {
      const days = differenceInDays(new Date(), activity.date);
      const goalDays = contact.goalDays;
      const isUserActivity = activity.type === ActivityType.User;

      const action = {
        contactFirstName: contact.firstName,
        contactLastName: contact.lastName,
        contactId: contact.id,
        title: contact.title,
        note: activity.note,
        days,
        goalDays,
        isNewUser: !isUserActivity,
      };

      const type = getActionType(activity, goalDays);

      if (type === UserType.Priority) {
        priorityActions.push(action);
      } else if (type === UserType.Upcoming) {
        upcomingActions.push(action);
      }
    }
  }

  return { priorityActions, upcomingActions };
};
