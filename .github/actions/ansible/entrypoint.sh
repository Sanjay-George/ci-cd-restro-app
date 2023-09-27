#!/bin/sh -l

echo $ANSIBLE_VAULT_PASSWORD > .vault

echo "playbook: $1"
echo "inventory: $2"
echo "limit: $3"

## TODO: TAKE INVENTORY AND PLAYBOOK AS INPUT
ansible-playbook -i $2 -l $3 $1 --vault-password-file .vault

rm .vault