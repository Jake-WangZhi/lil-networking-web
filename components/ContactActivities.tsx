import { Activity } from "@/types";
import { Circle, PlusCircle, Trash2 } from "react-feather";

interface Props {
  activities: Activity[] | null;
}

export const ContactActivites = ({ activities }: Props) => {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <div>Activites</div>
        <div className="flex items-center space-x-1">
          <PlusCircle size={24} />
          <div>Log Activity</div>
        </div>
      </div>
      {activities?.map((activity, index) => (
        <div key={`activity-${index}`}>
          <Circle
            size={16}
            fill="#38ACE2"
            color="#38ACE2"
            className="absolute bg-dark-blue w-4 h-7 flex items-center -mt-2"
          />
          <div
            className={`flex pb-4 ml-[7px] bg-dark-blue ${
              index + 1 !== activities?.length &&
              "border-l-2 border-light-blue border-dashed"
            }`}
          >
            <div className="bg-white bg-opacity-5 w-full ml-6 p-4 text-white rounded-lg">
              <div className="flex justify-between">
                <div className="text-base font-semibold">{activity.title}</div>
                <Trash2 size={24} />
              </div>
              <div className="text-sm opacity-[0.7] mb-2">{activity.date}</div>
              <div className="text-sm">{activity.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
