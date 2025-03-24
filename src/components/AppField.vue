<template>
	<div :class="['field', { field__radio: props.type === 'radio' }]">
		<label class="field__description" :for="props.id">{{ props.label }}</label>
		<input
			:id="props.id"
			class="field__input"
			:name="props.name ?? props.id"
			:disabled="props.disabled"
			:inputmode="props.inputmode ?? 'text'"
			:type="props.type ?? 'text'"
			v-maska="props.mask"
			:value="props.type === 'radio' ? props.id : props.modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			@change="props.type === 'radio' ? $emit('changes', $event.target.value) : null"
		/>
		<p class="field__error">{{ props.error }}</p>
	</div>
</template>

<script setup>
	import { vMaska } from 'maska/vue'

	const props = defineProps({
		modelValue: [String, Number, Boolean],
		id: String,
		name: String,
		type: String,
		inputmode: String,
		label: String,
		disabled: Boolean,
		error: String,
		mask: String,
		maskToken: String,
		maskReversed: Boolean
	})
</script>

<style lang="scss">
	.field {
		& + .field {
			margin-top: 15px;
		}

		&__radio {
			display: inline-block;
			width: 50%;
		}

		&__input {
			border: 1px #666 solid;
			border-radius: 5px;
			box-sizing: border-box;
			margin-top: 3px;
			padding: 7px 10px;
			transition: border-color 0.3s ease;
			width: 100%;

			&:focus {
				border-color: #ff9900;
			}

			&[type='radio'] {
				float: left;
				margin-right: 5px;
				width: auto;
			}
		}

		&__error {
			color: #ff0000;
			font-size: 0.8em;
		}
	}
</style>
