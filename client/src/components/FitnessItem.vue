<template>
  <div>
    <b-list-group>
        <b-list-group-item style="color: white" class="d-flex justify-content-between align-items-center bg-secondary">
            {{ fitnessObject.task }}
        <b-badge variant="warning" pill>{{ fitnessObject.typeExperience }} exp</b-badge>
        </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>

export default {
  name: 'fitness-item',
  props: ['fitnessObject']
}
</script>
