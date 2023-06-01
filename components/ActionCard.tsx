import { Action, ActionType } from "@/types";
import { ArrowRight } from "react-feather";
import Link from "next/link";

interface Props {
  action: Action;
  actionType: ActionType;
}

export const ActionCard = ({ action, actionType }: Props) => {
  return (
    <Link href="/dashboard">
      <div className="bg-white bg-opacity-5 p-4 mb-4 hover:bg-opacity-[0.08] active:bg-opacity-10 rounded-lg">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h2 className="md:text-xl lg:text-2xl overflow-hidden break-words">
              {action.contactName}
            </h2>
            <ArrowRight className="md:w-6 md:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
          </div>
          <div className="text-sm font-normal text-white text-opacity-70 md:text-base lg:text-lg overflow-hidden break-words">
            {action.contactIndustry && <>{action.contactIndustry} • </>}
            Goal: {action.goalDays} days
          </div>
          <div
            className={`text-sm md:text-base lg:text-lg font-semibold
              ${actionType === "past" ? "text-magenta" : "text-light-yellow"}
              `}
          >
            {action.days} Days ago
          </div>
          <p className="text-sm md:text-base lg:text-lg line-clamp-2 overflow-hidden">
            {action.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
