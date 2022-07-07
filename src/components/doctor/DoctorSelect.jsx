import { Select } from "@mantine/core";
import { useQuery } from "react-query";

import { listDoctors } from "../../api/api";

const DoctorSelect = ({ label, name, required, ...others }) => {
  const doctors = useQuery(
    ["listDoctors"],
    async () => {
      const response = await listDoctors();
      return response[1];
    },
    {
      keepPreviousData: true,
      select: (response) => {
        return response.map((doctor) => ({
          label: doctor.name,
          value: doctor.id,
        }));
      },
    }
  );
  return (
    <Select
      label={label}
      name={name}
      {...others}
      data={doctors.data || []}
      required={required}
    />
  );
};
export default DoctorSelect;
