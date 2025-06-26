export default function Footer() {
  return (
    <footer className="bg-[#202020] text-white py-6 mt-auto">
      <div className="mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} ELS. All rights reserved.
      </div>
    </footer>
  );
}
