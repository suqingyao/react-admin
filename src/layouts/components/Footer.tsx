export default function Footer() {
  return (
    <div className="bg-[#f5f5f5] h-16 w-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-[#999]">
          &copy;
          {' '}
          {new Date().getFullYear()}
          {' '}
          React Admin
        </p>
      </div>
    </div>
  );
}
