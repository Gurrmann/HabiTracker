<template>
  <div>
    <b-list-group>
        <b-list-group-item v-if="completedObject.task !== undefined" style="color: white" class="d-flex justify-content-between align-items-center bg-secondary">
            {{ completedObject.task }}
        <b-badge variant="warning" pill>Keep it going!</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="completedObject.task === undefined" style="color: white" class="d-flex justify-content-between align-items-center bg-secondary">
            {{ completedObject.name }}
        <b-badge variant="warning" pill>Keep it going!</b-badge>
        </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>

export default {
  name: 'completed-item',
  props: ['completedObject']
}
</script>
