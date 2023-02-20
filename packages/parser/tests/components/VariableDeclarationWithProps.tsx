interface Props {
  required: true;
  notRequired?: false;
}

type ComponentProps = Props;

const Default = (props: Props) => {
  return null;
};

export const Named = (props: ComponentProps) => {
  return null;
};

export const Normal = (props: { required: true; notRequired?: false }) => {
  return null;
};

interface ExtendsProps extends Props {
  onClick(evt: MouseEvent, index: number): void;
  onDoubleClick?: (evt: MouseEvent) => void;
}

export const Extends = (props: ExtendsProps) => {
  return null;
};

export default Default;
