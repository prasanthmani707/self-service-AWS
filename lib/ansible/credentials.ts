export function ansibleCredentialMode() { return { privateKeyPath: process.env.ANSIBLE_PRIVATE_KEY_PATH, user: process.env.ANSIBLE_REMOTE_USER ?? "ec2-user" }; }
