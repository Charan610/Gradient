import React from "react";
import { registerRoot, Composition } from "remotion";
import { GradientFilm, GradientThumbnail } from "./Film";
const Root = () => (
  <>
    <Composition
      id="GradientFilm"
      component={GradientFilm}
      durationInFrames={2340}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ captions: false }}
    />
    <Composition
      id="GradientThumbnail"
      component={GradientThumbnail}
      durationInFrames={1}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(Root);
