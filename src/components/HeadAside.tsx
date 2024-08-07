'use client';

import Image from 'next/image';
import BulletPoints from './BulletPoints';

interface HeadAsideProps {
  colors: Colors;
}
interface Colors {
  normal: string;
  lighter: string;
  light: string;
}

const HeadAside: React.FC<HeadAsideProps> = ({ colors }) => {
  const { normal, lighter, light } = colors;
  return (
    <>
      <header className="padding-around-global desktop-hide tab-hide">
        <Image
          className="PS-logo desktop-hide"
          src="/PS-logo.png"
          alt="PS logo"
          width="70"
          height="70"
        />
      </header>
      <aside className="side-width mob-hide">
        <div className="max-height-inner max-height row-gap">
          <header className="padding-around-global">
            <Image
              className="PS-logo"
              src="/PS-logo.png"
              alt="PS logo"
              width="70"
              height="70"
            />
          </header>
          <main className="row-gap_40 main__wrapper padding-around-global">
            <BulletPoints
              colors={{
                normal,
                lighter,
                light,
              }}
            />
            <div className="row-gap row-gap_10">
              <h3 className="text-23x1 black-medium">
                Feedback Shapes Better Outcomes
              </h3>
            </div>
          </main>
        </div>
      </aside>
    </>
  );
};
export default HeadAside;