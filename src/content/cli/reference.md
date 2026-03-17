## anuma new

```
Usage: anuma new [options]

Create a new project from a starter template

Options:
  --starter <name>  starter template (mini, next, telegram)
  --privy <id>      Privy app ID
  -h, --help        display help for command

```

## anuma auth

```
Usage: anuma auth [options] [command]

Log in to use the Anuma API

Options:
  -h, --help       display help for command

Commands:
  login [options]  Save your API key
  status           Show current authentication status
  logout           Remove saved API key
  help [command]   display help for command

```

## anuma auth login

```
Usage: anuma auth login [options]

Save your API key

Options:
  --api-key <key>  Anuma API key
  -h, --help       display help for command

```

## anuma auth status

```
Usage: anuma auth status [options]

Show current authentication status

Options:
  -h, --help  display help for command

```

## anuma auth logout

```
Usage: anuma auth logout [options]

Remove saved API key

Options:
  -h, --help  display help for command

```

## anuma chat

```
Usage: anuma chat [options]

Start an interactive chat session

Options:
  --api-url <url>    API base URL
  --model <name>     Model to use (default: "openai/gpt-4o")
  --system <prompt>  System prompt
  --no-tools         Disable client-side tools
  -h, --help         display help for command

```

## anuma docs

```
Usage: anuma docs [options]

Display help information for all available commands and their subcommands

Options:
  --json      Output documentation as JSON (tools schema)
  -h, --help  display help for command

```

## anuma api

```
Usage: anuma api [options] [command]

Anuma platform API

Options:
  --api-url <url>  API base URL (overrides ~/.anuma/config.json)
  -h, --help       display help for command

Commands:
  agents           Manage agents
  chat             Create chat completion
  config           Get configuration
  credits          Manage credits
  developer        Manage developer
  embeddings       Create embeddings
  models           List available models
  responses        Create response
  subscriptions    Manage subscriptions
  tasks            Get available tasks
  text             Manage text
  tools            List available tools
  usage            Get usage by model
  help [command]   display help for command

```

## anuma api agents

```
Usage: anuma api agents [options] [command]

Manage agents

Options:
  -h, --help      display help for command

Commands:
  get <id>        Get agent
  list            List agents
  help [command]  display help for command

```

## anuma api agents get

```
Usage: anuma api agents get [options] <id>

Get agent

Arguments:
  id          Agent ID

Options:
  -h, --help  display help for command

```

## anuma api agents list

```
Usage: anuma api agents list [options]

List agents

Options:
  -h, --help  display help for command

```

## anuma api chat

```
Usage: anuma api chat [options] [command]

Create chat completion

Options:
  -h, --help             display help for command

Commands:
  completions [options]  Create chat completion
  help [command]         display help for command

```

## anuma api chat completions

```
Usage: anuma api chat completions [options]

Create chat completion

Options:
  --image-model <value>  ImageModel is the user-selected image generation model.
                         When set, the portal overrides the model field in image
                         tool call arguments.
  --messages <value>     Messages is the conversation history
  --model <value>        Model is the model identifier
  --stream <value>       Stream indicates if response should be streamed
  --tool-choice <value>  tool_choice
  --tools <value>        Tools is an array of tool schemas describing which
                         tools the model can use
  --json <data>          Request body as JSON string
  -h, --help             display help for command

```

## anuma api config

```
Usage: anuma api config [options] [command]

Get configuration

Options:
  -h, --help      display help for command

Commands:
  list            Get configuration
  help [command]  display help for command

```

## anuma api config list

```
Usage: anuma api config list [options]

Get configuration

Options:
  -h, --help  display help for command

```

## anuma api credits

```
Usage: anuma api credits [options] [command]

Manage credits

Options:
  -h, --help            display help for command

Commands:
  balance               Get credit balance
  claim-daily           Claim daily credits
  claim-task [options]  Claim task reward
  packs                 List available credit packs
  purchase [options]    Create credit pack checkout session
  sync-snag             Sync Snag points
  help [command]        display help for command

```

## anuma api credits balance

```
Usage: anuma api credits balance [options]

Get credit balance

Options:
  -h, --help  display help for command

```

## anuma api credits claim-daily

```
Usage: anuma api credits claim-daily [options]

Claim daily credits

Options:
  -h, --help  display help for command

```

## anuma api credits claim-task

```
Usage: anuma api credits claim-task [options]

Claim task reward

Options:
  --memories <value>   memories
  --task-type <value>  task_type
  --json <data>        Request body as JSON string
  -h, --help           display help for command

```

## anuma api credits packs

```
Usage: anuma api credits packs [options]

List available credit packs

Options:
  -h, --help  display help for command

```

## anuma api credits purchase

```
Usage: anuma api credits purchase [options]

Create credit pack checkout session

Options:
  --cancel-url <value>   cancel_url
  --credits <value>      credits
  --referral <value>     Rewardful referral ID for affiliate tracking
  --success-url <value>  success_url
  --json <data>          Request body as JSON string
  -h, --help             display help for command

```

## anuma api credits sync-snag

```
Usage: anuma api credits sync-snag [options]

Sync Snag points

Options:
  -h, --help  display help for command

```

## anuma api developer

```
Usage: anuma api developer [options] [command]

Manage developer

Options:
  -h, --help         display help for command

Commands:
  billing [options]  Get billing history
  apps               Manage apps
  help [command]     display help for command

```

## anuma api developer billing

```
Usage: anuma api developer billing [options]

Get billing history

Options:
  --limit <value>   Maximum number of records to return (default 50, max 100)
  --offset <value>  Number of records to skip (default 0)
  -h, --help        display help for command

```

## anuma api developer apps

```
Usage: anuma api developer apps [options] [command]

Manage apps

Options:
  -h, --help                   display help for command

Commands:
  create [options]             Create app
  delete <app-uuid>            Delete app
  fund [options] <app-uuid>    Fund developer app balance
  get <app-uuid>               Get app
  list [options]               List apps
  update [options] <app-uuid>  Update app
  usage [options] <app-uuid>   Get app usage
  api-keys                     Manage api keys
  privy                        Manage privy
  users                        Manage users
  help [command]               display help for command

```

## anuma api developer apps create

```
Usage: anuma api developer apps create [options]

Create app

Options:
  --allowed-origins <value>       allowed CORS origins for API key requests
  --app-type <value>              "standard" (default) or "pooled_api"
  --default-user-credits <value>  credits per new user (1 credit = $0.01)
  --name <value>                  name
  --json <data>                   Request body as JSON string
  -h, --help                      display help for command

```

## anuma api developer apps delete

```
Usage: anuma api developer apps delete [options] <app-uuid>

Delete app

Arguments:
  app-uuid    App UUID

Options:
  -h, --help  display help for command

```

## anuma api developer apps fund

```
Usage: anuma api developer apps fund [options] <app-uuid>

Fund developer app balance

Arguments:
  app-uuid               App UUID

Options:
  --cancel-url <value>   URL to redirect if payment is cancelled
  --credits <value>      Number of credits to purchase (1 credit = $0.01)
  --referral <value>     Rewardful referral ID for affiliate tracking
  --success-url <value>  URL to redirect after successful payment
  --json <data>          Request body as JSON string
  -h, --help             display help for command

```

## anuma api developer apps get

```
Usage: anuma api developer apps get [options] <app-uuid>

Get app

Arguments:
  app-uuid    App UUID

Options:
  -h, --help  display help for command

```

## anuma api developer apps list

```
Usage: anuma api developer apps list [options]

List apps

Options:
  --limit <value>   Maximum number of apps to return (default 50, max 100)
  --offset <value>  Number of apps to skip (default 0)
  -h, --help        display help for command

```

## anuma api developer apps update

```
Usage: anuma api developer apps update [options] <app-uuid>

Update app

Arguments:
  app-uuid                        App UUID

Options:
  --allowed-origins <value>       nil=skip, []=clear, populated=set
  --default-user-credits <value>  credits per new user (1 credit = $0.01)
  --name <value>                  name
  --json <data>                   Request body as JSON string
  -h, --help                      display help for command

```

## anuma api developer apps usage

```
Usage: anuma api developer apps usage [options] [command] <app-uuid>

Get app usage

Arguments:
  app-uuid                    App UUID

Options:
  --start-time <value>        Start time (RFC3339). Defaults to 30 days ago.
  --end-time <value>          End time (RFC3339). Defaults to now.
  --granularity <value>       Timeseries granularity: 'day' (default) or 'hour'
  -h, --help                  display help for command

Commands:
  users [options] <app-uuid>  Get app user usage

```

## anuma api developer apps usage users

```
Usage: anuma api developer apps usage users [options] <app-uuid>

Get app user usage

Arguments:
  app-uuid              App UUID

Options:
  --start-time <value>  Start time (RFC3339). Defaults to 30 days ago.
  --end-time <value>    End time (RFC3339). Defaults to now.
  --limit <value>       Number of results (default 50, max 100)
  --offset <value>      Offset for pagination (default 0)
  -h, --help            display help for command

```

## anuma api developer apps api-keys

```
Usage: anuma api developer apps api-keys [options] [command]

Manage api keys

Options:
  -h, --help                   display help for command

Commands:
  create [options] <app-uuid>  Create API key
  delete <app-uuid> <key-id>   Delete API key
  list [options] <app-uuid>    List API keys
  help [command]               display help for command

```

## anuma api developer apps api-keys create

```
Usage: anuma api developer apps api-keys create [options] <app-uuid>

Create API key

Arguments:
  app-uuid           App UUID

Options:
  --is-test <value>  is_test
  --name <value>     name
  --json <data>      Request body as JSON string
  -h, --help         display help for command

```

## anuma api developer apps api-keys delete

```
Usage: anuma api developer apps api-keys delete [options] <app-uuid> <key-id>

Delete API key

Arguments:
  app-uuid    App UUID
  key-id      API Key ID

Options:
  -h, --help  display help for command

```

## anuma api developer apps api-keys list

```
Usage: anuma api developer apps api-keys list [options] <app-uuid>

List API keys

Arguments:
  app-uuid          App UUID

Options:
  --limit <value>   Maximum number of API keys to return (default 50, max 100)
  --offset <value>  Number of API keys to skip (default 0)
  -h, --help        display help for command

```

## anuma api developer apps privy

```
Usage: anuma api developer apps privy [options] [command]

Manage privy

Options:
  -h, --help                   display help for command

Commands:
  create [options] <app-uuid>  Configure Privy
  delete <app-uuid>            Remove Privy
  help [command]               display help for command

```

## anuma api developer apps privy create

```
Usage: anuma api developer apps privy create [options] <app-uuid>

Configure Privy

Arguments:
  app-uuid                          App UUID

Options:
  --privy-app-id <value>            privy_app_id
  --privy-verification-key <value>  privy_verification_key
  --json <data>                     Request body as JSON string
  -h, --help                        display help for command

```

## anuma api developer apps privy delete

```
Usage: anuma api developer apps privy delete [options] <app-uuid>

Remove Privy

Arguments:
  app-uuid    App UUID

Options:
  -h, --help  display help for command

```

## anuma api developer apps users

```
Usage: anuma api developer apps users [options] [command]

Manage users

Options:
  -h, --help                             display help for command

Commands:
  get <app-uuid> <address>               Get user
  list [options] <app-uuid>              List users
  top-up [options] <app-uuid> <address>  Top up user credits
  update [options] <app-uuid> <address>  Update user limit
  help [command]                         display help for command

```

## anuma api developer apps users get

```
Usage: anuma api developer apps users get [options] <app-uuid> <address>

Get user

Arguments:
  app-uuid    App UUID
  address     User wallet address

Options:
  -h, --help  display help for command

```

## anuma api developer apps users list

```
Usage: anuma api developer apps users list [options] <app-uuid>

List users

Arguments:
  app-uuid          App UUID

Options:
  --limit <value>   Maximum number of users to return (default 50, max 200)
  --offset <value>  Number of users to skip (default 0)
  -h, --help        display help for command

```

## anuma api developer apps users top-up

```
Usage: anuma api developer apps users top-up [options] <app-uuid> <address>

Top up user credits

Arguments:
  app-uuid           App UUID
  address            User wallet address

Options:
  --credits <value>  credits to add (1 credit = $0.01)
  --json <data>      Request body as JSON string
  -h, --help         display help for command

```

## anuma api developer apps users update

```
Usage: anuma api developer apps users update [options] <app-uuid> <address>

Update user limit

Arguments:
  app-uuid           App UUID
  address            User wallet address

Options:
  --credits <value>  credit limit (1 credit = $0.01)
  --json <data>      Request body as JSON string
  -h, --help         display help for command

```

## anuma api embeddings

```
Usage: anuma api embeddings [options] [command]

Create embeddings

Options:
  -h, --help        display help for command

Commands:
  create [options]  Create embeddings
  help [command]    display help for command

```

## anuma api embeddings create

```
Usage: anuma api embeddings create [options]

Create embeddings

Options:
  --dimensions <value>       Dimensions is the number of dimensions the
                             resulting output embeddings should have (optional)
  --encoding-format <value>  EncodingFormat is the format to return the
                             embeddings in (optional: "float" or "base64")
  --input <value>            Input text or tokens to embed (can be string,
                             []string, []int, or [][]int)
  --model <value>            Model identifier in 'provider/model' format
  --json <data>              Request body as JSON string
  -h, --help                 display help for command

```

## anuma api models

```
Usage: anuma api models [options] [command]

List available models

Options:
  -h, --help      display help for command

Commands:
  list [options]  List available models
  help [command]  display help for command

```

## anuma api models list

```
Usage: anuma api models list [options]

List available models

Options:
  --provider <value>    Filter by provider (e.g., openai, anthropic)
  --page-size <value>   Number of models to return per page
  --page-token <value>  Token to get next page of results
  -h, --help            display help for command

```

## anuma api responses

```
Usage: anuma api responses [options] [command]

Create response

Options:
  -h, --help        display help for command

Commands:
  create [options]  Create response
  help [command]    display help for command

```

## anuma api responses create

```
Usage: anuma api responses create [options]

Create response

Options:
  --background <value>         Background indicates if request should be
                               processed in background
  --image-model <value>        ImageModel is the user-selected image generation
                               model.
                               When set, the portal overrides the model field in
                               image tool call arguments.
  --input <value>              input
  --max-output-tokens <value>  MaxOutputTokens is the maximum number of tokens
                               to generate
  --model <value>              Model is the model identifier in 'provider/model'
                               format
  --reasoning <value>          reasoning
  --stream <value>             Stream indicates if response should be streamed
  --temperature <value>        Temperature controls randomness (0.0 to 2.0)
  --thinking <value>           thinking
  --tool-choice <value>        tool_choice
  --tools <value>              Tools is an array of tool schemas describing
                               which tools the model can use
  --json <data>                Request body as JSON string
  -h, --help                   display help for command

```

## anuma api subscriptions

```
Usage: anuma api subscriptions [options] [command]

Manage subscriptions

Options:
  -h, --help                         display help for command

Commands:
  cancel                             Cancel subscription
  cancel-scheduled-downgrade         Cancel scheduled downgrade
  create-checkout-session [options]  Create checkout session
  customer-portal [options]          Create customer portal session
  plans                              List available subscription plans
  renew                              Renew subscription
  schedule-downgrade [options]       Schedule subscription downgrade
  status                             Get subscription status
  upgrade [options]                  Upgrade subscription
  webhook                            Handle Stripe webhook
  help [command]                     display help for command

```

## anuma api subscriptions cancel

```
Usage: anuma api subscriptions cancel [options]

Cancel subscription

Options:
  -h, --help  display help for command

```

## anuma api subscriptions cancel-scheduled-downgrade

```
Usage: anuma api subscriptions cancel-scheduled-downgrade [options]

Cancel scheduled downgrade

Options:
  -h, --help  display help for command

```

## anuma api subscriptions create-checkout-session

```
Usage: anuma api subscriptions create-checkout-session [options]

Create checkout session

Options:
  --cancel-url <value>   cancel_url
  --interval <value>     "month" or "year"
  --price-id <value>     price_id
  --referral <value>     Rewardful referral ID for affiliate tracking
  --success-url <value>  success_url
  --tier <value>         "starter" or "pro"
  --json <data>          Request body as JSON string
  -h, --help             display help for command

```

## anuma api subscriptions customer-portal

```
Usage: anuma api subscriptions customer-portal [options]

Create customer portal session

Options:
  --return-url <value>  return_url
  --json <data>         Request body as JSON string
  -h, --help            display help for command

```

## anuma api subscriptions plans

```
Usage: anuma api subscriptions plans [options]

List available subscription plans

Options:
  -h, --help  display help for command

```

## anuma api subscriptions renew

```
Usage: anuma api subscriptions renew [options]

Renew subscription

Options:
  -h, --help  display help for command

```

## anuma api subscriptions schedule-downgrade

```
Usage: anuma api subscriptions schedule-downgrade [options]

Schedule subscription downgrade

Options:
  --interval <value>  "month" or "year"; defaults to current interval
  --tier <value>      target tier, e.g. "starter"
  --json <data>       Request body as JSON string
  -h, --help          display help for command

```

## anuma api subscriptions status

```
Usage: anuma api subscriptions status [options]

Get subscription status

Options:
  -h, --help  display help for command

```

## anuma api subscriptions upgrade

```
Usage: anuma api subscriptions upgrade [options]

Upgrade subscription

Options:
  --interval <value>  Optional: "month" or "year" (defaults to current)
  --tier <value>      Required: "starter" or "pro"
  --json <data>       Request body as JSON string
  -h, --help          display help for command

```

## anuma api subscriptions webhook

```
Usage: anuma api subscriptions webhook [options]

Handle Stripe webhook

Options:
  -h, --help  display help for command

```

## anuma api tasks

```
Usage: anuma api tasks [options] [command]

Get available tasks

Options:
  -h, --help      display help for command

Commands:
  list            Get available tasks
  help [command]  display help for command

```

## anuma api tasks list

```
Usage: anuma api tasks list [options]

Get available tasks

Options:
  -h, --help  display help for command

```

## anuma api text

```
Usage: anuma api text [options] [command]

Manage text

Options:
  -h, --help                    display help for command

Commands:
  lookup [options] <channel>    Lookup text channel registration by identifier
  register [options] <channel>  Register identifier for text channel
  status <channel>              Get text channel registration status
  unregister <channel>          Unregister text channel
  help [command]                display help for command

```

## anuma api text lookup

```
Usage: anuma api text lookup [options] <channel>

Lookup text channel registration by identifier

Arguments:
  channel               Text channel (sms, telegram)

Options:
  --identifier <value>  Channel identifier (e.g., E.164 phone number for SMS)
  -h, --help            display help for command

```

## anuma api text register

```
Usage: anuma api text register [options] <channel>

Register identifier for text channel

Arguments:
  channel                    Text channel (sms, telegram)

Options:
  --identifier <value>       identifier
  --preferred-model <value>  preferred_model
  --json <data>              Request body as JSON string
  -h, --help                 display help for command

```

## anuma api text status

```
Usage: anuma api text status [options] <channel>

Get text channel registration status

Arguments:
  channel     Text channel (sms, telegram)

Options:
  -h, --help  display help for command

```

## anuma api text unregister

```
Usage: anuma api text unregister [options] <channel>

Unregister text channel

Arguments:
  channel     Text channel (sms, telegram)

Options:
  -h, --help  display help for command

```

## anuma api tools

```
Usage: anuma api tools [options] [command]

List available tools

Options:
  -h, --help      display help for command

Commands:
  list            List available tools
  help [command]  display help for command

```

## anuma api tools list

```
Usage: anuma api tools list [options]

List available tools

Options:
  -h, --help  display help for command

```

## anuma api usage

```
Usage: anuma api usage [options] [command]

Get usage by model

Options:
  -h, --help        display help for command

Commands:
  models [options]  Get usage by model
  help [command]    display help for command

```

## anuma api usage models

```
Usage: anuma api usage models [options]

Get usage by model

Options:
  --start <value>   Start of date range in RFC 3339 format (e.g.
                    2024-01-01T00:00:00Z). Must be used with end. Takes
                    precedence over period.
  --end <value>     End of date range in RFC 3339 format (e.g.
                    2024-01-31T23:59:59Z). Must be used with start. Takes
                    precedence over period.
  --period <value>  Time period. Day aliases: 7d, 30d, 90d, 180d, 365d.
                    Durations: 10m, 30m, 1h, 6h, 12h, 24h, 72h. Default: 30d.
                    Max: 365d.
  -h, --help        display help for command

```
