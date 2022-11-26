import { useState, forwardRef } from "react";

import { Text, Select, Group } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "react-query";

import { listPatients } from "../../api/api";
import { capitalize, omit } from "../../helpers/utils";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef(({ label, description, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  </div>
));

const PatientSearchSelect = ({
  value,
  onChange,
  label,
  placeholder,
  ...others
}) => {
  const [patientNameSearchText, setPatientNameSearchText] = useState("");
  const [patientDebouncedSearchText] = useDebouncedValue(
    patientNameSearchText,
    300
  );
  const patients = useQuery(
    ["listPatients", { limit: 10, page: 1, patientDebouncedSearchText }],
    async () => {
      const response = await listPatients(
        omit({
          limit: 10,
          page: 1,
          name: patientDebouncedSearchText,
        })
      );
      return response[1];
    },
    {
      keepPreviousData: true,
      select: (response) => {
        return response.data?.map((patient) => ({
          label: patient.name,
          value: patient.id,
          description: `${patient.phone} | ${capitalize(patient.gender)} | ${
            patient.age
          } ${patient.age === 1 ? "Year" : "Years"} old `,
        }));
      },
    }
  );
  return (
    <Select
      label={label}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      data={patients.data || []}
      searchable={true}
      clearable={true}
      onSearchChange={setPatientNameSearchText}
      itemComponent={SelectItem}
      {...others}
    />
  );
};
export default PatientSearchSelect;
