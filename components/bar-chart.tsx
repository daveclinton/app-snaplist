import * as React from "react";
import { BarChart } from "react-native-chart-kit";

export const MyBarChart = () => {
  return (
    <BarChart
      data={{
        labels: ["January", "February", "March", "April", "May", "June", ""],
        datasets: [
          {
            data: [90, 80, 28, 80, 99, 43, 20, 45, 28, 80, 99, 43],
            colors: [
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
              () => "#0064D2",
            ],
          },
        ],
      }}
      width={200}
      height={60}
      yAxisLabel={""}
      yAxisSuffix={""}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      withCustomBarColorFromData={true}
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: () => `rgba(0, 0, 0, 0)`,
      }}
    />
  );
};
