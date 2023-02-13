interface Props {
  required: true;
  notRequired?: false;
}

type ComponentProps = Props;

export default function Default(props: Props) {
  return null;
}

export function Named(props: ComponentProps) {
  return null;
}

export function Normal(props: { required: true; notRequired?: false }) {
  return null;
}

interface ExtendsProps extends Props {
  onClick(evt: MouseEvent, index: number): void;
  onDoubleClick?: (evt: MouseEvent) => void;
}

export function Extends(props: ExtendsProps) {
  return null;
}
