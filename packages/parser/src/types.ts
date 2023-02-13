export interface Comp {
  name: string;
  props: Prop[];
  methods: Method[];
  description?: string;
  subComponent?: Omit<Comp, 'subComponent'>;
}

export interface Prop<T extends unknown = unknown> {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: T;
}

export interface Method {
  name: string;
  params: string;
  returns: string;
  required: boolean;
  description?: string;
}

export interface ParserResult {
  [key: 'default' | string]: Comp;
}
