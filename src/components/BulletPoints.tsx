'use client';

interface HeadAsideProps {
  colors: Colors;
}
interface Colors {
  normal: string;
  lighter: string;
  light: string;
}

const BulletPoints: React.FC<HeadAsideProps> = ({ colors }) => {
  const { normal, lighter, light } = colors;

  return (
    <ul className="bullet_list_items row-gap row-gap_20 row-gap-mob">
      <li className="align-center">
        <div className={`bullet ${normal}`}></div>
        <p>Your Voice Matters</p>
      </li>
      <li className="align-center">
        <div className={`bullet ${lighter}`}></div>
        <p>Real Impact</p>
      </li>
      <li className="align-center">
        <div className={`bullet ${light}`}></div>
        <p>Easy Participation</p>
      </li>
      <li className="align-center">
        <div className="bullet highlight"></div>
        <p>Personalized Experience</p>
      </li>
    </ul>
  );
};
export default BulletPoints;
