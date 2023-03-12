export declare const sql: {
    mysql: {
        schema: {
            charset: string;
            collate: string;
            comment: string;
        };
        table: {
            schema: string;
            charset: string;
            collate: string;
            comment: string;
            primary_key: {
                columns: string;
            };
            index: {
                comment: string;
                type: string[];
                columns: string;
                unique: string[];
                on: {
                    column: string;
                    desc: string;
                    where: string;
                    prefix: string;
                };
            };
            foreign_key: {
                columns: string;
                ref_columns: string;
                on_delete: string[];
                on_update: string[];
            };
            column: {
                auto_increment: string[];
                comment: string;
                type: string[];
            };
        };
    };
    sql: {
        schema: {};
    };
};
