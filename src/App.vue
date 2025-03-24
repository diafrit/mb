<template>
	<form class="register" @submit.prevent="send">
		<fieldset
			v-for="(step, index) in register"
			:key="index"
			:class="['register__step', `register__step__${index + 1}`, { 'register__step--active': index === registerActive }]"
		>
			<p class="step__status">
				Etapa <span>{{ index + 1 }}</span> de {{ register.length }}
			</p>
			<h2 class="step__title">{{ step.title }}</h2>

			<AppField
				v-for="(field, key) in step.fields"
				:key="index + key"
				:id="`register_${index}_${key}`"
				:name="`register_${field.name ?? key}`"
				:label="field.label"
				:type="field.type"
				:checker="docType"
				:inputmode="field.inputmode"
				:disabled="index === 3"
				:error="field.error"
				:mask="field.mask"
				:maskToken="field.maskToken"
				:maskReversed="field.maskReversed"
				v-model="field.data"
				@changes="setDocType"
			/>

			<div class="step__actions">
				<button v-if="index > 0" class="btn__previous" title="Voltar para etapa anterior" @click.prevent="navigate('previous')">Voltar</button>
				<button v-if="index < register.length - 1" class="btn__next" title="Continuar cadastro" @click.prevent="navigate('next')">Continuar</button>
				<button v-else class="btn__register" title="Finalizar cadastro" type="submit">Cadastrar</button>
			</div>
		</fieldset>
	</form>
</template>

<script setup>
	import { ref } from 'vue'
	import AppField from '@/components/AppField.vue'
	import { cpf, cnpj } from '@/helpers/validator/document'

	// Step 1
	const docType = ref('')
	const userType = ref({
		email: {
			label: 'Endereço de e-mail',
			type: 'email',
			data: ''
		},
		cpf: {
			name: 'document',
			label: 'Pessoa física',
			type: 'radio',
			data: docType.value
		},
		cnpj: {
			name: 'document',
			label: 'Pessoa jurídica',
			type: 'radio',
			data: docType.value
		}
	})

	const isCPF = ref('')
	const setDocType = (e) => {
		docType.value = e
		isCPF.value = e.includes('cpf')
	}

	// Step 2
	const userDocument = ref({
		name: {
			data: ''
		},
		document: {
			inputmode: 'numeric',
			data: ''
		},
		date: {
			type: 'date',
			data: ''
		},
		phone: {
			label: 'Telefone',
			inputmode: 'numeric',
			data: '',
			maskToken: '0:[0-9]:optional',
			maskReversed: true,
			mask: '(##) 0####-####'
		}
	})

	// Step 3
	const userPassword = ref({
		password: {
			label: 'Sua senha',
			type: 'password',
			data: ''
		}
	})

	const userRevision = ref({ email: userType.value.email, ...userDocument.value })

	// User form register
	const register = ref([
		{
			title: 'Seja bem vindo(a)',
			fields: userType.value
		},
		{
			title: 'Pessoa Física',
			fields: userDocument.value
		},
		{
			title: 'Senha de acesso',
			fields: userPassword.value
		},
		{
			title: 'Revise suas informações',
			fields: userRevision.value
		}
	])

	// Set active step
	const registerActive = ref(0)

	// Form navigation
	const navigate = (direction) => {
		if (direction === 'next' && validate()) registerActive.value++
		else if (direction === 'previous') registerActive.value--

		// Change document type
		if (registerActive.value === 1) {
			userDocument.value.name.label = isCPF.value ? 'Nome' : 'Razão social'
			userDocument.value.document.label = isCPF.value ? 'CPF' : 'CNPJ'
			userDocument.value.document.mask = isCPF.value ? '###.###.###-##' : '##.###.###/####-##'
			userDocument.value.date.label = `Data de ${isCPF.value ? 'nascimento' : 'abertura'}`
		}
	}

	// Basic form validation
	const validate = () => {
		const step = register.value[registerActive.value].fields
		const fields = Object.keys(step)

		for (const f of fields) {
			const active = step[f]

			active.error = '' // Reset

			// Email
			if (active.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(active.data)) active.error = 'E-mail inválido'

			// Date
			if (active.type === 'date') {
				const date = new Date(active.data)
				if (isNaN(date)) active.error = 'Data inválida'
			}

			// Document
			if (f === 'document') {
				const doc = active.data.replace(/\D/g, '') // Remove mask

				if (isCPF.value && !cpf(doc)) active.error = 'CPF inválido'
				else if (!isCPF.value && !cnpj(doc)) active.error = 'CNPJ inválido'
			}

			// Required
			if (active.type !== 'radio' && !active.data) active.error = 'Campo obrigatório'
		}

		return Object.values(step).every((s) => !s.error)
	}

	// Post user data
	const send = async () => {
		let data = Object.entries(userRevision.value).reduce((acc, [key, value]) => {
			acc[key] = value.data
			return acc
		}, {})

		data = { ...data, password: userPassword.value.password.data }

		const response = await fetch('http://localhost:3000/registration', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})

		const content = await response.json()
		alert(content.message)
	}
</script>

<style scoped lang="scss">
	$primary: #ff9900;

	.register {
		&__step {
			left: 50%;
			max-height: 0;
			max-width: 90%;
			padding: 20px;
			position: absolute;
			top: 50px;
			opacity: 0;
			transform: translateX(-50%);
			transition:
				max-height 0.2s ease,
				opacity 0.2s ease,
				z-index 0.2s ease;
			width: 350px;

			&--active {
				max-height: 100vh;
				opacity: 1;
				z-index: 2;
			}

			.step {
				&__status {
					font-size: 0.8em;
					margin-bottom: 10px;

					span {
						color: $primary;
					}
				}

				&__title {
					font-size: 1.5em;
					margin-bottom: 30px;
				}

				&__actions {
					display: flex;
					gap: 10px;
					justify-content: space-between;
					margin-top: 20px;

					button {
						background-color: $primary;
						border: 1px $primary solid;
						border-radius: 5px;
						color: #fff;
						cursor: pointer;
						flex-grow: 1;
						padding: 8px 20px;
						text-align: center;
						transition: all 0.2s ease;

						&:hover {
							background-color: $primary;
							color: #fff;
							opacity: 0.7;
						}

						.btn {
							&__previous {
								background-color: #fff;
								border-color: $primary;
								color: $primary;
							}
						}
					}
				}
			}
		}
	}
</style>
