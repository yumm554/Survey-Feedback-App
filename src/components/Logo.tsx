import Image from 'next/image';

const Logo = () => {
  return (
    <>
      <Image
        className="PS-logo"
        src="/PS-logo.png"
        alt="PS logo"
        width="70"
        height="38"
      />
    </>
  );
};
export default Logo;
