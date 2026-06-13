import { Label, Radio, RadioGroup } from "@heroui/react";

interface RoleRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoleRadioGroup({ value, onChange }: RoleRadioGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-white/78">Account Type</Label>
      <RadioGroup
        name="role"
        orientation="horizontal"
        value={value}
        onChange={onChange}
      >
        <Radio value="applicant">
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label className="text-white/78">Applicant</Label>
          </Radio.Content>
        </Radio>
        <Radio value="recruiter">
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label className="text-white/78">Recruiter</Label>
          </Radio.Content>
        </Radio>
      </RadioGroup>
    </div>
  );
}
