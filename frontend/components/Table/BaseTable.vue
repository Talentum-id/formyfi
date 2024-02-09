<template>
  <div class="base-table">
    <div class="header-body">
      <div class="header-row">
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="header-cell"
          :class="{ empty: !rows.length, sort: isSorting }"
          :style="{ textAlign: column.justify || 'left', width: column.width || '100%' }"
          @click="sortByColumn(column.prop, column.cantSort)"
        >
          {{ column.label }}
          <Sort
            v-if="column.label && isSorting && !column.cantSort"
            :direction="sortColumn === modifyStringSpaces(column.label) ? sortDirection : 'none'"
          />
        </div>
      </div>
    </div>

    <div v-if="rows.length > 0" class="body">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="row"
        :class="{
          pointer,
          isTop: row.isTop,
          personal: checkIsPropertyExist(row, 'isPersonalTask') && row.isPersonalTask,
          isMultiComponents,
        }"
        :style="{
          justifyItems: row.justify || 'left',
        }"
      >
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="cell"
          :class="{ isMultiComponents }"
          :style="{ width: column.width || '100%', justifyContent: column.justify || 'left' }"
        >
          <div
            v-if="checkIsPropertyExist(row[column.prop], 'adjust') && row[column.prop].adjust"
            class="adjust"
          >
            <Icon name="Right-Arrow1" :size="20" class="arrow-color" />
          </div>
          <div
            v-if="
              checkIsPropertyExist(row[column.prop], 'adjustReturnBtn') &&
              row[column.prop].adjustReturnBtn
            "
            class="adjust-btn"
          >
            <ReturnBtn />
          </div>
          <div class="mobile-header-row">
            <div class="mobile-header-cell">
              {{ column.label }}
            </div>

            <template
              v-if="
                checkIsPropertyExist(row, column.prop) &&
                !checkIsPropertyExist(row[column.prop], 'component') &&
                checkIsPropertyExist(row[column.prop], 'content')
              "
            >
              <div class="table-text">
                {{
                  checkIsPropertyExist(row[column.prop], 'reduceLength') &&
                  row[column.prop].reduceLength
                    ? reduceStringLength(row[column.prop].content, row[column.prop].reduceLength)
                    : row[column.prop].content
                }}
              </div>
            </template>

            <div v-else-if="checkIsPropertyExist(row[column.prop], 'contents')">
              <div class="multi-components">
                <div
                  v-for="item in row[column.prop].contents"
                  :key="item.id"
                  class="multi-component table-text"
                >
                  {{
                    checkIsPropertyExist(row[column.prop], 'reduceLength') &&
                    row[column.prop].reduceLength
                      ? reduceStringLength(item, row[column.prop].reduceLength)
                      : item
                  }}
                </div>
              </div>
            </div>

            <div v-else-if="checkIsPropertyExist(row[column.prop], 'components')">
              <div class="multi-components">
                <div
                  v-for="item in row[column.prop].components"
                  :key="item.id"
                  class="multi-component"
                >
                  <component :is="item.component" :="item.props" />
                </div>
              </div>
            </div>

            <template
              v-else-if="
                checkIsPropertyExist(row, column.prop) &&
                !checkIsPropertyExist(row[column.prop], 'component')
              "
            >
              <div class="table-text">
                {{
                  checkIsPropertyExist(row[column.prop], 'reduceLength') &&
                  row[column.prop].reduceLength
                    ? reduceStringLength(row[column.prop], row[column.prop].reduceLength)
                    : row[column.prop]
                }}
              </div>
            </template>

            <template v-else-if="checkIsPropertyExist(row[column.prop], 'component')">
              <component
                :is="row[column.prop].component"
                :="row[column.prop].props"
                @clickFromComponent="$emit('clickFromComponent', $event)"
                @next="$emit('next')"
                @prev="$emit('prev')"
                @current="$emit('current', $event)"
              />
            </template>

            <template v-else />
          </div>
        </div>
      </div>
    </div>
    <EmptyList v-else :title="title" :icon="icon" />
  </div>
</template>

<script>
import arrowRight from '@/assets/icons/arrow-right.svg';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength, checkIsPropertyExist, modifyStringSpaces } from '@/util/helpers';
import EmptyList from '@/components/Table/EmptyList.vue';
import Sort from '@/components/Table/Sort.vue';
import Icon from '@/components/Icons/Icon.vue';
import ReturnBtn from '@/components/Table/ReturnBtn.vue';

export default {
  name: 'BaseTable',
  components: { ReturnBtn, Icon, Sort, EmptyList },
  data() {
    return {
      reduceStringLength,
      arrowRight,
      checkIsPropertyExist,
      modifyStringSpaces,
    };
  },
  mixins: [windowSizeMixin],
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    sortDirection: {
      type: String,
      default: '',
    },
    setSortDirection: {
      type: Function,
      default: null,
    },
    sortColumn: {
      type: String,
      default: '',
    },
    setSortColumn: {
      type: Function,
      default: null,
    },
    pointer: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loaded: { type: Boolean, default: false },
    isMultiComponents: { type: Boolean, default: false },
    sortFunction: {
      type: Function,
      default: null,
    },
    isSorting: { type: Boolean, default: false },
  },
  mounted() {},
  methods: {
    toHandler(row) {
      if (this.checkIsPropertyExist(row, 'to')) {
        this.$router.push(row.to);
      }
    },
    sortByColumn(column, cantSort) {
      if (!this.isSorting || cantSort) return;
      if (this.sortColumn === column) {
        if (this.sortDirection === '') {
          this.setSortDirection('desc');
          this.sortFunction(column, 'desc');
        } else if (this.sortDirection === 'desc') {
          this.setSortDirection('asc');
          this.sortFunction(column, 'asc');
        } else {
          this.setSortDirection('');
          this.sortFunction(column, '');
        }
      } else {
        this.setSortColumn(column);
        this.setSortDirection('desc');
        this.sortFunction(column, 'desc');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.single-component {
  visibility: inherit;
  // &.collapse {
  //   visibility: hidden;
  // }
}

.multi-component {
  display: flex;
  align-items: center;
  height: 32px;
}

.multi-components {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  max-width: fit-content;
  opacity: 1;
  // max-width: 0px;
  // opacity: 0;
  // display: none;
  // margin-top: 14px;
  // transition: max-width 1s ease-in;

  // &.collapse {
  //   max-width: fit-content;
  //   opacity: 1;
  //   // display: flex;
  // }
}
.table-text {
  font-family: 'Basis Grotesque Pro';
  color: $default;
}
.adjust {
  position: absolute;
  top: 17px;
  right: -40px;
}
.arrow-color {
  filter: invert(77%) sepia(28%) saturate(391%) hue-rotate(204deg) brightness(86%) contrast(83%);
}
.adjust-btn {
  position: absolute;
  top: 19px;
  right: 30px;
}
.base-table {
  font-family: 'Basis Grotesque Pro';
  font-size: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  grid-gap: 8px;
  width: 100%;
}

.header-body {
  grid-row: 1;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  width: 100%;
}

.header-row {
  width: 100%;
  background: #e9ecf2;
  border: 1px solid #e9ecf2;
  border-radius: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
  min-height: 64px;
  padding: 0 20px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $header-text-list;
}

.header-cell {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $header-text-list;
  &.sort {
    display: flex;
    gap: 3px;
    cursor: pointer;
  }
  &.empty {
    color: $secondary;
  }
}

.body {
  grid-row: 2;
  grid-column: 1 / -1;
  display: grid;
  // grid-template-rows: repeat(auto-fit, minmax(30px, 1fr));
}

.row {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  overflow: inherit;
  min-height: 64px;
  padding: 0 20px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $section-title;
  &.isMultiComponents {
    max-height: fit-content;
    padding: 20px;
  }
  &.personal {
    border: 2px solid rgba(252, 102, 12, 1);
    &.pointer {
      cursor: pointer;
      &:hover {
        border: 2px solid $default;
      }
    }
  }
  &.pointer {
    cursor: pointer;
    &:hover {
      border: 1px solid $default;
    }
  }
}

.cell {
  font-family: 'Basis Grotesque Pro';
  display: flex;
  align-items: center;
  text-align: left;
  color: black;
  position: relative;
  &.isMultiComponents {
    align-items: inherit;
  }
}

.mobile-header-cell {
  display: none;
}

@media (max-width: 768px) {
  .mobile-header-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .mobile-header-cell {
    display: block;
    background: $default-badge-border;
  }
  .cell {
    background: linear-gradient(to right, $default-badge-border 40%, $white 30%);
    padding: 10px;
    width: auto !important;
  }
  .base-table {
    font-size: 12px;
  }

  .header-row {
    display: none;
  }

  .body {
    grid-template-rows: repeat(auto-fit, minmax(100px, 1fr));
  }

  .row {
    display: flex;
    flex-direction: column;
    margin-bottom: 10;
    padding: 0;
  }
}

.isTop {
  border: 1px solid $hover-row-border !important;
  background: $hover-row-bg !important;
  &:hover {
    border: 3px solid $hover-row-border !important;
    background: $hover-row-bg !important;
    .top {
      background: $hover-row-bg-top !important;
      color: $orange !important;
    }
  }
}
</style>
