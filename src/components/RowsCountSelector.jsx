import { useState } from "react";

import { Select } from "@mantine/core";

const RowsCountSelector = ({ value, onChange }) => {
  const [limitOptions, setLimitOptions] = useState(["10", "25", "50", "100"]);
  return (
    <Select
      data={limitOptions}
      value={value}
      label="Rows"
      onChange={onChange}
      creatable
      searchable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(value) => {
        setLimitOptions(
          [...limitOptions, value].sort((a, b) => parseInt(a) - parseInt(b))
        );
        onChange(value);
      }}
    />
  );
};
export default RowsCountSelector;
