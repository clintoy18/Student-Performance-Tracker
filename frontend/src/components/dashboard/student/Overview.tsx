import React from "react";
import Card from "../../common/Card";
import { ChartBarIncreasing } from "lucide-react";

const Overview = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card
        title="Overall Average"
        icon={ChartBarIncreasing}
        percentage="85%"
        description="Your performance compared to last month"
      />
    </div>
  );
};

export default Overview;
