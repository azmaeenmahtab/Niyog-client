import { Label, Radio, RadioGroup } from "@heroui/react";

export function RoleRadioGroup({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-white/78">Subscription plan</Label>
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
            {/* <Description>For side projects</Description> */}
          </Radio.Content>
        </Radio>
        <Radio value="manager">
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label className="text-white/78">Manager</Label>
            {/* <Description>Advanced reporting</Description> */}
          </Radio.Content>
        </Radio>
         
      </RadioGroup>
    </div>
  );
}