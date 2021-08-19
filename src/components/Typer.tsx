/* eslint-disable @typescript-eslint/no-empty-function */
import Typewriter from "typewriter-effect";

export function Typer() {
  return (
    <Typewriter
      options={{
        strings: ["Estudante de TI", "Desenvolvedor React"],
        autoStart: true,
        loop: true,
      }}
      onInit={() => {}}
    />
  );
}
