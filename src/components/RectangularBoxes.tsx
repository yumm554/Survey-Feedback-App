'use client';

interface HeadAsideProps {
  colors: Colors;
}
interface Colors {
  normal: string;
  lighter: string;
  light: string;
}

const RectangularBoxes: React.FC<HeadAsideProps> = ({ colors }) => {
  const { normal, lighter, light } = colors;

  return (
    <div className="boxes align-center">
      <div className={`rectangular-box ${normal}`}></div>
      <div className={`rectangular-box ${lighter}`}></div>
      <div className={`rectangular-box ${light}`}></div>
      <div className="rectangular-box highlight"></div>
    </div>
  );
};
export default RectangularBoxes;
