import Tracker from "@/components/tracker";
import { use } from "react";

export default function MealTrackerPage({
  params,
}: {
  params: Promise<{ meal: string }>;
}) {
  const { meal } = use(params);
  return (
    <>
      <Tracker mealType={meal} />
    </>
  );
}
