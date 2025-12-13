import { FC } from "react";

const HistorySection: FC = () => (
  <section className="py-20 bg-secondary/30 dark:bg-gray-900/50">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-primary rounded-2xl hidden md:block"></div>
          <div
            className="relative h-96 w-full rounded-2xl bg-cover bg-center shadow-lg"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCh3QHrCuRjXS6eEJrxSkQFDa6bu1N5mATcdJGSi72ufrPRE6uTpUdpUGjJdQrkUw6-8fTLNaKFPb-OdlqVMvGCpWFnu27e7v-jK3FJ6czK7Nf8NtedabNsBG0dQObqlOtqJYKjkGmnjW-RuMZhthKBscMvw4pbyvy31vkgv2T0riIZ6r8xDpSNfbzkNBtp7boAcbu7KsGSMtSa8Av6GrR-ErTirpllOcCDbLaGyPZdangYOAwbL5NIcfXDl83huKQ3jZkbctyVhDJj")`,
            }}
          />
        </div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-6">
          <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Our Origins</h3>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">From a Simple Idea to a Movement</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              ErgoZenix started with a simple observation: too many people were suffering from discomfort and pain due to poorly designed office furniture. Our founder, an industrial designer with a passion for human-centered design, set out to create a better way to work.
            </p>
            <p>
              From our first prototype to a full range of ergonomic products, our journey has been driven by a commitment to quality, innovation, and the well-being of our customers. We are proud to be a part of a movement towards healthier, more productive workspaces for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HistorySection;
