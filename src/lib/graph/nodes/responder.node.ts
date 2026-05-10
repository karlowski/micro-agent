import { State } from '../state/index.js';

export default async (state: State) => {
  return { output: state.output };
};
