resource "aws_cloudwatch_event_rule" "every_thirty_minutes" {
    name = "every-thirty-minutes"
    description = "Fires every thirty minutes"
    schedule_expression = "rate(30 minutes)"
}

resource "aws_cloudwatch_event_target" "tweet_every_thirty_minutes" {
    rule = "${aws_cloudwatch_event_rule.every_thirty_minutes.name}"
    arn = "${var.apex_function_tweet}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_tweet" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = "${var.apex_function_tweet}"
    principal = "events.amazonaws.com"
    source_arn = "${aws_cloudwatch_event_rule.every_thirty_minutes.arn}"
}
