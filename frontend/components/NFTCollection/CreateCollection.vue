<template>
  <BaseModalNew :visible="true" @close="$emit('close')">
    <div class="p-10 flex flex-col gap-8">
      <div class="font-familyLight font-regular text-3xl">Create NFT Collection</div>

      <div class="flex flex-col gap-2">
        <div class="text-md font-medium">Cover Image</div>
        <div class="text-xs font-medium text-secondary-60">
          Recommended size — 480 x 760 px. PNG, JPG, GIF, SVG, JPEG. Maximum 5 MB.
        </div>
        <TaskBannerUploader :setImage="handleFileUpload" :banner="item.file" :isEditingActive="true"
          :isError="!item.file && errorItem.uri.isError && errorItem.uri.text" errorText="Cover Image is Required" />
        <div v-if="errorItem.uri.isError && errorItem.uri.text" class="editor-error">
          {{ errorItem.uri.text }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-md font-medium">Blockchain</div>
        <div class="text-xs font-medium text-secondary-60">
          Choose the blockchain on which the collection is created.
        </div>
        <Select filter isVertical :options="chainList" @input="setBlockchain" type="create" :default="chainList[0]" />
      </div>
      <!-- <div class="flex flex-col gap-2" v-if="+item.blockchain_id !== 101">
        <div class="text-md font-medium">Collection Type</div>
        <div class="text-xs font-medium text-secondary-60">
          Choose the type of NFT collection you want to create.
        </div>
        <FilterToggle :buttons="collectionTypes" :id="collectionId" @select="setCollection" class="w-full"
          fixedWidth="100%" />
      </div> -->


      <div class="flex flex-col">
        <div class="text-md font-medium">Collection Name</div>
        <div class="text-xs font-medium text-secondary-60">
          Enter at least 3 and no more than 15 characters.
        </div>
        <Input v-model="item.name" :isError="errorItem.name.isError" :error-text="errorItem.name.text"
          @input="clearError('name')" placeholder="Enter the collection name" />
      </div>

      <div class="flex flex-col">
        <div class="text-md font-medium">Collection Symbol</div>
        <div class="text-xs font-medium text-secondary-60">
          Enter at least 3 and no more than 6 characters.
        </div>
        <Input v-model="item.symbol" :isError="errorItem.symbol.isError" :error-text="errorItem.symbol.text"
          @input="clearError('symbol')" placeholder="Enter the collection symbol" />
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-md font-medium">Collection Description</div>
        <div class="text-xs font-medium text-secondary-60">
          Enter at least 3 and no more than 20 characters.
        </div>
        <Editor :description="item.description" @update="handleDescriptionUpdate"
          :isError="errorItem.description.isError" :errorText="errorItem.description.text"
          placeholder="Enter the Collection description" />
      </div>


      <hr />

      <div class="flex flex-col gap-2">
        <div class="text-md font-medium">Max Supply</div>
        <NumberInput v-model="item.max_supply" placeholder="0" type="number" :required="true" class="!w-full"
          :isDisabled="item.unlimited_supply" />
        <Checkbox label="The supply is not limited" text="Unlimited" @checked="setUnlimited"
          :checkedProp="item.unlimited_supply" />
      </div>

      <div class="flex w-full gap-2 justify-between">
        <div class="text-md font-medium">Transferable</div>
        <Switch @checked="item.transferable = $event" :checkedProp="item.transferable" type="small" />
      </div>

      <BaseButton type="normal" @click="handleCreateCollection" :loading="isLoading">
        Create NFT Collection
      </BaseButton>
    </div>
  </BaseModalNew>
  <Alert :message="errorMessage" type="error" v-if="showError"></Alert>
  <Alert message="Success" type="success" v-if="showSuccess"></Alert>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Components
import FilterToggle from '@/components/Creating/FilterToggle.vue';
import Editor from '@/components/Creating/Editor.vue';
import CustomUpload from '@/components/Creating/CustomUpload.vue';
import NumberInput from '@/components/NumberInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import Checkbox from '@/components/Creating/Checkbox.vue';
import LoadingModal from '@/components/Modal/LoadingModal.vue';
import BaseModalNew from '@/components/BaseModalNew.vue';
import Input from '@/components/Input.vue';
import Switch from '@/components/Creating/Switch.vue';
import Select from '@/components/Select.vue';
import Alert from '@/components/Alert.vue';
import TaskBannerUploader from '@/components/Creating/TaskBannerUploader.vue';
import axiosService from '@/services/axiosService';
import { useZkLogin } from '@/composables/useZkLogin';
import { useCollectionsStore } from '@/store/collections';
// Web3
import {
  deploy,
  createNFTId,
  getContractAddress,
  getTokenId,
  switchNetwork,
  chains,
} from '@/web3/nft';
import { modal } from '@/mixins/modal';

const emit = defineEmits(['close', 'update']);

const { deploySui, getContractAddressSui, getContractMetaSui } = useZkLogin();
const isLoading = ref(false);
const isLoadingModalOpen = ref(false);
const collectionId = ref(0);
const file = ref(null);
const showError = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Constants
const collectionTypes = [
  { title: 'ERC-721', id: 0, name: 'erc_721' },
  { title: 'ERC-1155', id: 1, name: 'erc_1155' },
];

const chainList = chains.map((item) => ({
  id: item.id,
  name: item.chainName,
}));

// Form data
const item = reactive({
  id: 1,
  name: '',
  symbol: '',
  uri: '',
  description: '',
  nftType: 'erc_721',
  file: null,
  blockchain_id: 10143,
  max_supply: 1,
  transferable: false,
  unlimited_supply: false,
  contract_address: '',
  token_id: { 'Null': null },
  owner: '',
});

const errorItem = reactive({
  name: { isError: false, text: '' },
  symbol: { isError: false, text: '' },
  description: { isError: false, text: '' },
  max_supply: { isError: false, text: '' },
  uri: { isError: false, text: '' },
});

const handleCloseLoading = (event) => {
  modal.emit('openModal', {
    title: 'Uploading collection...',
    message: 'Please wait for a while',
    type: 'loading',
  });
};

const setCollection = (event) => {
  collectionId.value = event.id;
  item.nftType = event.name;
};

const setBlockchain = (blockchain) => {
  item.blockchain_id = blockchain.id;
};

const setUnlimited = (event) => {
  item.unlimited_supply = event;
  item.max_supply = event ? null : 1;
};

const clearError = (field) => {
  errorItem[field].isError = false;
  errorItem[field].text = '';
};

const handleDescriptionUpdate = (e) => {
  clearError('description');
  item.description = e;
};

const handleFileUpload = (image) => {
  file.value = image;
  item.file = image[0]?.raw;
  item.uri = 'mock-uri';
  clearError('uri');
};

const stripHtmlTags = (input) => {
  return input.replace(/<[^>]*>/g, '');
};

const validateForm = () => {
  const errors = {
    name: { isError: false, text: '' },
    symbol: { isError: false, text: '' },
    description: { isError: false, text: '' },
    max_supply: { isError: false, text: '' },
    uri: { isError: false, text: '' },
  };

  const strippedDescription = stripHtmlTags(item.description);
  item.description = strippedDescription;

  // Name validation
  if (item.name.length < 3 || item.name.length > 15) {
    errors.name.isError = true;
    errors.name.text = 'The Collection Name must be at least 3 characters long and no more than 15';
  }

  // Symbol validation
  if (item.symbol.length < 3 || item.symbol.length > 6) {
    errors.symbol.isError = true;
    errors.symbol.text = 'The symbol must be at least 3 characters long and no more than 6';
  }

  // Description validation
  if (!strippedDescription || strippedDescription.length < 3 || strippedDescription.length > 20) {
    errors.description.isError = true;
    errors.description.text =
      'The description must be at least 3 characters long and no more than 20';
  }

  // URI validation
  if (!item.uri) {
    errors.uri.isError = true;
    errors.uri.text = 'The file field is required';
  }

  // Supply validation
  if (!item.max_supply && !item.unlimited_supply) {
    errors.max_supply.isError = true;
    errors.max_supply.text = 'Supply must be greater than 0';
  }

  Object.assign(errorItem, errors);
  return !Object.values(errors).some((error) => error.isError);
};

const handleCreateCollection = async () => {
  if (!validateForm()) {
    showError.value = true;
    errorMessage.value = 'Please fix the errors in the form';
    resetAlert();
    return;
  }

  await modal.emit('openModal', {
    title: 'Uploading collection...',
    message: 'Please wait for a while',
    type: 'loading',
  });

  try {
    if (typeof file.value !== 'string') {
      const formData = new FormData();
      const realTime = Math.floor(new Date().getTime() / 1000);
      let index = 0;
      formData.append('files[]', file.value);
      formData.append('paths[]', `/${process.env.DFX_NETWORK}/collection/${realTime}/${index}`);

      await axiosService
        .post(`${process.env.API_URL}upload-files`, formData)
        .then(({ data }) => (item.file = data))
        .catch((e) => {
          throw e;
        });

      index++;
    }
    if (+item.blockchain_id === 101) {
      await deploySui(item).then(async () => {
        item.contract_address = await getContractAddressSui();
        item.meta = await getContractMetaSui();
      });
    } else {
      await switchNetwork(item.blockchain_id);
      await deploy(item);
      item.contract_address = await getContractAddress();
    }
    showSuccess.value = true;
    successMessage.value = 'Collection created successfully';
    console.log(item);
    await useCollectionsStore().createCollection(item);
    emit('update');
    modal.emit('closeModal', {});
    emit('close');
  } catch (error) {
    console.error('Error creating collection:', error);
    showError.value = true;
    errorMessage.value = error.message || 'Failed to create collection';
  } finally {
    isLoading.value = false;
    isLoadingModalOpen.value = false;
    showError.value = true;
    emit('update');
    modal.emit('closeModal', {});
    emit('close');
    resetAlert();
  }
};

const resetAlert = () => {
  setTimeout(() => {
    showError.value = false;
    showSuccess.value = false;
    errorMessage.value = '';
    successMessage.value = '';
  }, 3000);
};
</script>
