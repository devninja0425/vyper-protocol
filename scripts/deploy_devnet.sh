#!/bin/bash

# vyper core
# anchor deploy -p vyper-core --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
# anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/vyper_core.json vyPErCcGJKQQBeeQ59gXcWrDyU4vBrq8qQfacwmsAsp

# rate mock plugin
# anchor deploy -p rate-mock --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json

# rate switchboard
# anchor deploy -p rate-switchboard --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/rate_switchboard.json 2hGXiH1oEQwjCXRx8bNdHTi49ScZp7Mj2bxcjxtULKe1

# rate pyth
# anchor deploy -p rate-pyth --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/rate_pyth.json å

# rate poolv2
# anchor deploy -p rate-poolv2 --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/rate_poolv2.json 5Vm2YZK3SeGbXbtQpKVByP9EvYy78ahnjFXKkf9B3yzW

# redeem logic fee plugin
# anchor deploy -p redeem-logic-lending-fee --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json

# redeem logic farming
# anchor deploy -p redeem-logic-farming --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_farming.json Fd87TGcYmWs1Gfa7XXZycJwt9kXjRs8axMtxCWtCmowN
anchor idl upgrade --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_farming.json Fd87TGcYmWs1Gfa7XXZycJwt9kXjRs8axMtxCWtCmowN

# redeem logic vanilla option
anchor deploy -p redeem-logic-vanilla-option --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_vanilla_option.json 8fSeRtFseNrjdf8quE2YELhuzLkHV7WEGRPA9Jz8xEVe
anchor idl upgrade --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_vanilla_option.json 8fSeRtFseNrjdf8quE2YELhuzLkHV7WEGRPA9Jz8xEVe

# redeem logic forward
# anchor deploy -p redeem-logic-forward --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json

# redeem logic settled-forward
anchor deploy -p redeem-logic-settled-forward --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster m --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_settled_forward.json 6vBg1GMtKj7EYDLWWt6tkHoDWLAAksNPbKWiXMic99qU
anchor idl upgrade --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_settled_forward.json 6vBg1GMtKj7EYDLWWt6tkHoDWLAAksNPbKWiXMic99qU

# redeem logic digital
anchor deploy -p redeem-logic-digital --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json
anchor idl init --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_digital.json 5Dq9PjUJUG5dM9DzYFqKA4YZYeKJfGaM5Gy7NjpY3p5r
anchor idl upgrade --provider.cluster d --provider.wallet ~/Dev/VyperWallets/vyper-program-authority/authority.json -f ./target/idl/redeem_logic_digital.json 5Dq9PjUJUG5dM9DzYFqKA4YZYeKJfGaM5Gy7NjpY3p5r

# # # # # # # # # # # # # # # # # # 
# RECOVERY
# # # # # # # # # # # # # # # # # # 

# solana-keygen recover -o ./ephemeral-kp.json prompt:// 
# solana program deploy --buffer ./ephemeral-kp.json --upgrade-authority ~/Dev/VyperWallets/vyper-program-authority/authority.json -k ~/Dev/VyperWallets/vyper-program-authority/authority.json ./target/deploy/redeem_logic_farming.so
