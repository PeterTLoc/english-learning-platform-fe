export default function Footer() {
  return (
    <footer className="bg-[#1D1D1D] text-white py-5 mt-auto">
      <div className="text-center text-xs">
        &copy; {new Date().getFullYear()} ELS. All rights reserved.
      </div>
    </footer>
  );
}
