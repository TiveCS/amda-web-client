import { Lop, LopActivity } from "@api/types/lops";
import { Checkbox } from "@mantine/core";

export default function LopTableItem({ lop }: { lop: Lop }) {
  const { activities } = lop;

  return (
    <>
      <tr>
        <td
          rowSpan={Math.max(activities ? activities.length : 0, 1)}
          className="w-48"
        >
          {lop.name}
        </td>
        {activities && activities.length === 0 && <LopTableFirstContent />}

        {activities && activities.length > 0 && (
          <LopTableFirstContent activity={activities[0]} />
        )}
      </tr>

      {activities &&
        activities.map((activity, i) => {
          if (i === 0) return null;

          return <LopTableContent activity={activity} key={i} />;
        })}
    </>
  );
}

const LopTableFirstContent: React.FC<{ activity?: LopActivity }> = ({
  activity,
}) => {
  return (
    <>
      {activity ? (
        <>
          <td>
            <Checkbox></Checkbox>
          </td>
          <td>{activity.sto.name}</td>
          <td className="w-48">{activity.workType}</td>
          <td>{activity.ticket.identifier}</td>
          <td>{activity.ticket.location}</td>
          <td>{activity.mitra.name}</td>
        </>
      ) : (
        <>
          <td>
            <Checkbox disabled></Checkbox>
          </td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </>
      )}
    </>
  );
};

const LopTableContent: React.FC<{ activity: LopActivity }> = ({ activity }) => {
  return (
    <tr>
      <td>
        <Checkbox></Checkbox>
      </td>
      <td>{activity.sto.name}</td>
      <td>{activity.workType}</td>
      <td>{activity.ticket.identifier}</td>
      <td>{activity.ticket.location}</td>
      <td>{activity.mitra.name}</td>
    </tr>
  );
};
