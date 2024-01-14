import { Link } from "@remix-run/react";
import { PlusIcon } from "~/svgs";

export default function Index() {
  return (
    <div>
      <Link className="button button--fab button--icon" to="/channels/new">
        <PlusIcon aria-label="Add Channel" />
      </Link>
    </div>
  );
}
