<template>
	<v-notice v-if="!collectionField && !collection" type="warning">
		{{ t('collection_field_not_setup') }}
	</v-notice>
	<v-notice v-else-if="selectItems.length === 0" type="warning">
		{{ t('select_a_collection') }}
	</v-notice>
	<v-select
		v-else
		:show-deselect="allowNone"
		:model-value="value"
		:disabled="disabled"
		:items="selectItems"
		:placeholder="placeholder"
		@update:model-value="$emit('input', $event)"
	/>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, computed, inject, ref, PropType } from 'vue';
import { useFieldsStore } from '@/stores';
import { Field } from '@directus/shared/types';

export default defineComponent({
	props: {
		collectionField: {
			type: String,
			default: null,
		},
		collection: {
			type: String,
			default: null,
		},
		typeAllowList: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		value: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: null,
		},
		allowNone: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['input'],
	setup(props) {
		const { t } = useI18n();

		const fieldsStore = useFieldsStore();

		const values = inject('values', ref<Record<string, any>>({}));

		const fields = computed(() => {
			if (!props.collectionField && !props.collection) return [];
			return fieldsStore.getFieldsForCollection(values.value[props.collectionField] || props.collection);
		});

		const selectItems = computed(() =>
			fields.value.map((field: Field) => {
				let disabled = false;

				if (field?.schema?.is_primary_key === true) disabled = true;
				if (props.typeAllowList.length > 0 && props.typeAllowList.includes(field.type) === false) disabled = true;

				return {
					text: field.name,
					value: field.field,
					disabled,
				};
			})
		);

		return { t, selectItems, values, fields };
	},
});
</script>
