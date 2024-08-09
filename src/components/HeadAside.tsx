'use client';

import BulletPoints from './BulletPoints';
import Logo from './Logo';

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
        <Logo />
      </header>
      <aside className="side-width mob-hide">
        <div className="max-height-inner max-height row-gap padding-around-global">
          <header className="mob-hide">
            <Logo />
          </header>
          <main className="row-gap_40 justify-left">
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
