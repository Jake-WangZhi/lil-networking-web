import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Activity, Contact, Prisma } from "@prisma/client";
import { SearchParams } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get(SearchParams.UserEmail);
  const name = searchParams.get(SearchParams.Name);

  if (!userEmail)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No User Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const contacts = await getContacts(name, user.id);

  const contactIds = contacts.map((c) => c.id);

  const activities = await getLatestActivitiesForContacts(contactIds);

  const parsedContacts = parseContacts(contacts, activities);

  return NextResponse.json(parsedContacts);
}

const parseContacts = (contacts: Contact[], activities: Activity[]) => {
  const parsedContacts = contacts.map((contact) => {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title,
      company: contact.company,
      industry: contact.industry,
      goalDays: contact.goalDays,
      email: contact.email,
      phone: contact.phone,
      links: contact.links,
      interests: contact.interests,
      activities: activities.filter(
        (activity) => activity.contactId === contact.id
      ),
      isArchived: contact.isArchived,
    };
  });

  return parsedContacts;
};

const getContacts = async (name: string | null, userId: string) => {
  let whereClause: Prisma.ContactWhereInput = {
    userId,
  };

  if (name) {
    const [firstName, lastName] = name.split(" ");

    if (lastName) {
      whereClause = {
        ...whereClause,
        firstName: { contains: firstName, mode: "insensitive" },
        lastName: { contains: lastName, mode: "insensitive" },
      };
    } else {
      whereClause = {
        ...whereClause,
        OR: [
          { firstName: { contains: firstName, mode: "insensitive" } },
          { lastName: { contains: firstName, mode: "insensitive" } },
        ],
      };
    }
  }

  const contacts = await prisma.contact.findMany({
    where: whereClause,
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  return contacts;
};

// Try to get the latest USER activities for each contact first,
// Then get the SYSTEM activities for the contacts who don't have any USER activities
const getLatestActivitiesForContacts = async (contactIds: string[]) => {
  const activities = await prisma.activity.findMany({
    where: {
      contactId: { in: contactIds },
      type: "USER",
    },
    orderBy: [
      {
        date: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const contactIdsWithActivity = new Set(
    activities.map((activity) => activity.contactId)
  );

  for (const contactId of contactIds) {
    const hasActivity = contactIdsWithActivity.has(contactId);

    if (!hasActivity) {
      const activity = await prisma.activity.findFirst({
        where: {
          contactId: contactId,
          type: "SYSTEM",
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (activity) {
        activities.push(activity);
      }
    }
  }

  return activities;
};
