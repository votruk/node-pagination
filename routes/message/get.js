var db = require('../../db').db;

var sql_start = "SELECT * FROM messages ";
var sql_end = "ORDER BY id DESC LIMIT ? OFFSET ?";
var find_id_of_message = "(SELECT id FROM messages WHERE message_id LIKE ?) ";

function get(req, res, next) {
    var __ret = get_sql_expression_with_arguments(req, res);
    var sql = __ret.sql;
    var arguments = __ret.arguments;

    db.all(sql, arguments, function (err, rows) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.json(rows);
        }
    });
}

function get_sql_expression_with_arguments(req, res) {
    var offset = calculate_offset(req);
    if (offset < 0) {
        res.json({error: "Negative offset not supported by now"});
        return;
    }
    var limit = calculate_limit(req);
    var sinceId = calculate_since_id(req);
    var tillId = calculate_till_id(req);

    var sql;
    var arguments;

    if (tillId === undefined && sinceId === undefined) {
        sql = get_stmt_without_anchors();
        arguments = [limit, offset];
    } else if (tillId !== undefined && sinceId === undefined) {
        sql = get_stmt_with_till_only();
        arguments = [tillId, limit, offset];
    } else if (tillId === undefined && sinceId !== undefined) {
        sql = get_stmt_with_since_only();
        arguments = [sinceId, limit, offset];
    } else {
        sql = get_stmt_with_since_and_till();
        arguments = [tillId, sinceId, limit, offset];
    }
    return {sql: sql, arguments: arguments};
}

function get_stmt_without_anchors() {
    return sql_start + sql_end;
}

function get_stmt_with_since_and_till() {
    return sql_start +
        "WHERE id > " +
        find_id_of_message +
        " AND id < " +
        find_id_of_message +
        sql_end;
}

function get_stmt_with_since_only() {
    return sql_start +
        "WHERE id < " +
        find_id_of_message +
        sql_end;
}

function get_stmt_with_till_only() {
    return sql_start +
        "WHERE id >" +
        find_id_of_message +
        sql_end;
}

function calculate_offset(req) {
    return parseInt(req.body.offset) || 0;
}

function calculate_limit(req) {
    return parseInt(req.body.limit) || 20;
}

function calculate_since_id(req) {
    return req.body.sinceId;
}

function calculate_till_id(req) {
    return req.body.tillId;
}

module.exports = get;