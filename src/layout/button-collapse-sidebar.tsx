"use client";

type Props = Readonly<{
  sidebarOpen: boolean;
  handleSidebarToggle: (value: boolean) => void;
}>;

export function ButtonColapseSidebar({
  sidebarOpen,
  handleSidebarToggle,
}: Props) {
  return (
    <>
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => handleSidebarToggle(false)}
        />
      )}
    </>
  );
}
