import _ from 'lodash';

export default {
  install(app) {
    const baseComponents = require.context('../components/base/', false, /[A-Za-z0-9-_,\s]+\.vue$/i);

    // keys() will return an Array of files found based on arguments passed in baseComponents
    baseComponents.keys().forEach((fileName) => {
      const componetConfig = baseComponents(fileName);
      /* webpack will return a component configuration object
      it's the same object you would pass to app component function */
      const componentName = _.upperFirst(_.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')));
      /* lodash, makes the component names to PascalCase.
      then with replace(), we remove / from the beginning and .vue from the end of the fileName */

      /* because of export default, we use .default in second arg.
      and we add Base to the beginning of the Name, to prevent naming Collisions.
      now we can write <base-Button /> anywhere in the app */
      app.component(`Base${componentName}`, componetConfig.default || componetConfig);
    });
  },
};
