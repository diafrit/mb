import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Maska from 'maska' // Field mask
import AppField from '@/components/AppField.vue'

// Mount wrapper with custom props
const wrapper = (p) => {
	return shallowMount(AppField, {
		global: {
			plugins: Maska
		},
		shallow: true,
		props: p
	})
}

// Pinia

// Elements
const e = (el, p) => wrapper(p).find(el)

describe('AppField', () => {
	// Field container
	it('div', () => {
		expect(e('.field').exists()).toBe(true)
	})

	// Basic input element
	it('input', () => {
		const id = 'name'
		const el = e('input', { id: id })
		expect(el.attributes('name')).toBe(id) // Name
		expect(el.attributes('type')).toBe('text') // Field type (default)
	})

	// Field label
	it('label', () => {
		const id = 'name'
		const label = 'Nome'
		const el = e('label', { id: id, label: label })

		expect(el.text()).toBe(label) // Text
		expect(el.attributes('for')).toBe(id) // Span ID
	})

	// Basic password type
	it('type', () => {
		expect(e('input', { type: 'password' }).attributes('type')).toBe('password')
	})

	// Inputmode for mobile keyboard devices
	it('inputmode', () => {
		expect(e('input', { inputmode: 'numeric' }).attributes('inputmode')).toBe('numeric')
	})

	// Radio field
	it('radio', () => {
		const el = e('input', { type: 'radio' })

		expect(el.attributes('type')).toBe('radio')
		expect(e('.field', { type: 'radio' }).classes()).toContain('field__radio')
	})

	// Disabled field
	it('disabled', () => {
		expect(e('input', { disabled: true }).attributes('disabled')).toBe('')
	})
})
