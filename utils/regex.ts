export const regex: Record<string, RegExp> = {
  email:
    /^([A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/,
  //don't include global flag if you are planning to do pattern matching with regex.test method. otherwise result will be unreliable

  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
};
