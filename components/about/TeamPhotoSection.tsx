import { FC } from "react";

const TeamPhotoSection: FC = () => (
  <div className="px-4 md:px-10 py-12">
    <div
      className="w-full h-[450px] bg-center bg-no-repeat bg-cover rounded-xl"
      style={{
        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuYKFV4kT2qbEtSU9PsZYPreVIZydrXef_a54M0dtPwZc6p7fYh20CQSjguqqzMFlVeC1prgyQnHUfk3RmpADGh15SeMVEv2jqlp_IakppnTLJeJBlFMNdfq1Sr3xfy6jybeXpawzke7b2jDDZNxCDg2T5NTj688uX2xxQ5wvVznV40vdXh3BVXaJHq26L52F2ElAJvcOrivpoMWfjV8PCw4GpTCe3I2Thjxmg9BEPMjF_kE_n0_ZrpBGOBQVXNid4t6pW-kLUVkZL")`,
      }}
    />
    <p className="text-center mt-4 text-sm text-muted-foreground">
      The ErgoFlex Team: Passionate about creating a healthier world, one workspace at a time.
    </p>
  </div>
);

export default TeamPhotoSection;
