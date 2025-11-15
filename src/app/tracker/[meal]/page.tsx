import Tracker from "../../components/tracker";

export default function MealTrackerPage({
  params,
}: {
  params: { meal: string };
}) {
  return (
    <>
      <Tracker mealType={params.meal} />
    </>
  );
}

