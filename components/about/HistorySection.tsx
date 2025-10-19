import { FC } from "react";

const HistorySection: FC = () => (
  <div className="px-4 md:px-10 py-12 bg-white dark:bg-background-dark">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-gray-800 dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] mb-4">
          From a Simple Idea to a Movement
        </h2>
        <p className="text-base font-normal leading-relaxed mb-4">
          ErgoFlex started with a simple observation: too many people were suffering from discomfort due to poorly designed office furniture.
        </p>
        <p className="text-base font-normal leading-relaxed">
          From our first prototype to a full range of ergonomic products, our journey has been driven by a commitment to <strong>quality</strong>, <strong>innovation</strong>, and <strong>well-being</strong>.
        </p>
      </div>
      <div
        className="w-full h-80 bg-center bg-no-repeat bg-cover rounded-xl"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCh3QHrCuRjXS6eEJrxSkQFDa6bu1N5mATcdJGSi72ufrPRE6uTpUdpUGjJdQrkUw6-8fTLNaKFPb-OdlqVMvGCpWFnu27e7v-jK3FJ6czK7Nf8NtedabNsBG0dQObqlOtqJYKjkGmnjW-RuMZhthKBscMvw4pbyvy31vkgv2T0riIZ6r8xDpSNfbzkNBtp7boAcbu7KsGSMtSa8Av6GrR-ErTirpllOcCDbLaGyPZdangYOAwbL5NIcfXDl83huKQ3jZkbctyVhDJj")`,
        }}
      />
    </div>
  </div>
);

export default HistorySection;
