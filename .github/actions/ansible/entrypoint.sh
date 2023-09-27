#!/bin/sh -l

echo $ANSIBLE_VAULT_PASSWORD > .vault

echo "playbook: $1"
echo "inventory: $2"

## TODO: TAKE INVENTORY AND PLAYBOOK AS INPUT
ansible-playbook -i $2 $1 --vault-password-file .vault

rm .vault