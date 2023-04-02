export const dataType = {
  string: '"${?}"',
  number: "${?}",
};

export default {
  variable: {
    type: dataType.string,
  },
  env: {
    src: dataType.string,
    url: dataType.string,
    dev: dataType.string,
    format: {
      migrate: {
        apply: dataType.number,
      },
    },
    migration: {
      dir: dataType.string,
      format: [
        "atlas",
        "flyway",
        "liquibase",
        "goose",
        "golang-migrate",
        "dbmate",
      ],
    },
    tenant: dataType.string,
  },
};
