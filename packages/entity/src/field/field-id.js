import idx from 'idx';
import AnyField from './field-any';

export default class IdField extends AnyField {
  constructor(configs = {}) {
    super(configs);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (configs.many) throw new Error(`${this.constructor.name}.constructor: "many" option is not supported.`);
    }
  }

  dataToValue(data) {
    return (idx(data, x => x.toString) instanceof Function)
      ? data.toString()
      : data;
  }

  default() {
    return undefined;
  }
}
