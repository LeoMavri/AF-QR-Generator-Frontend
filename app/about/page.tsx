import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <>
      <div>
        <h1 className={title()}>Participanti</h1>
      </div>

      <div className="py-3">
        Radu-Leonard Mavrodin <br></br>
        <li>Backend - Typescript, Node.js, Express.js, TypeORM, Zod</li>
      </div>
      <div className="py-3">
        Octavian Eduard Pantazi <br></br>
        <li>Database - Postgres, Hosting</li>
      </div>
      <div className="py-3">
        Lupascu Mihaita Eduard <br></br>
        <li>Frontend - Typescript, Next.js</li>
      </div>
      <div className="py-3">
        Lupu Miruna Cristina <br></br>
        <li>Design Frontend - NextUI, Figma</li>
      </div>
    </>
  );
}
